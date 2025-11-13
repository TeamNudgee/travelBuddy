import { useEffect, useState, useContext } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression, DivIcon } from 'leaflet';
import L from 'leaflet';
import { Header } from '@/components/layout/Header';
import { LocationSearchBar } from './LocationSearchBar';
import { AuthContext } from '@/contexts/AuthContext';
import { UserQuery } from '@/query/UserQuery';
import { TrustQuery } from '@/query/TrustQuery';
import { FofUtils, type FOFUser } from '@/utils/FofUtils';
import type { AppUser } from '@/model/AppUser';
import type { TrustReaction } from '@/model/TrustReaction';
import 'leaflet/dist/leaflet.css';

// 서울시청 좌표 (fallback)
const DEFAULT_CENTER: LatLngExpression = [37.5665, 126.978];
const DEFAULT_ZOOM = 13;

// Leaflet 기본 아이콘 설정 해제
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/**
 * 프로필 이미지를 마커로 변환
 * @param imageUrl 프로필 이미지 URL
 * @param borderColor 테두리 색상 (trust score 기반)
 * @param isCurrentUser 현재 사용자 여부
 */
const createProfileMarker = (
  imageUrl: string,
  borderColor: string = '#3b82f6',
  isCurrentUser: boolean = false
): DivIcon => {
  const size = 40;
  const borderWidth = 3;

  return new L.DivIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: ${borderWidth}px solid ${borderColor};
        overflow: hidden;
        background: white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        ${isCurrentUser ? 'border-width: 4px; box-shadow: 0 0 0 2px white, 0 0 0 4px ' + borderColor + ';' : ''}
      ">
        <img
          src="${imageUrl}"
          style="width: 100%; height: 100%; object-fit: cover;"
          alt="profile"
        />
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// 지도 중심 업데이트 컴포넌트
function MapCenterUpdater({ center }: { center: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, DEFAULT_ZOOM);
  }, [center, map]);
  return null;
}

export const MapPage = () => {
  const { appUser } = useContext(AuthContext);
  const [myLocation, setMyLocation] = useState<LatLngExpression>(DEFAULT_CENTER);
  const [mapCenter, setMapCenter] = useState<LatLngExpression>(DEFAULT_CENTER);
  const [allUsers, setAllUsers] = useState<AppUser[]>([]);
  const [friends, setFriends] = useState<AppUser[]>([]);
  const [fofUsers, setFofUsers] = useState<FOFUser[]>([]);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);

  // 현재 위치 가져오기 (GPS 또는 Firestore geo)
  useEffect(() => {
    // Firestore에 저장된 geo가 있으면 먼저 사용
    if (appUser?.data.geo) {
      const savedLocation: LatLngExpression = [appUser.data.geo.lat, appUser.data.geo.lng];
      setMyLocation(savedLocation);
      setMapCenter(savedLocation);
      return;
    }

    // geo가 없으면 GPS 시도
    if (!navigator.geolocation) {
      console.warn('Geolocation이 지원되지 않습니다.');
      setLocationPermissionDenied(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // GPS 성공 시 그대로 사용 (cityName 없음)
        const { latitude, longitude } = position.coords;
        const currentLocation: LatLngExpression = [latitude, longitude];
        setMyLocation(currentLocation);
        setMapCenter(currentLocation);

        // GPS 좌표를 Firestore에 저장 (cityName 없이)
        if (appUser) {
          UserQuery.updateLocation(appUser.id, { lat: latitude, lng: longitude }).catch((err) =>
            console.error('GPS 위치 저장 오류:', err)
          );
        }
      },
      (error) => {
        console.error('위치 권한 거부 또는 오류:', error);
        setLocationPermissionDenied(true);
      }
    );
  }, [appUser]);

  // Firestore에서 친구 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      if (!appUser) return;

      try {
        const myFriendIds = appUser.data.friends || [];
        if (myFriendIds.length === 0) {
          console.log('친구가 없습니다.');
          return;
        }

        // 1촌 가져오기
        const firstDegreeUsers = await UserQuery.findByIdIn(myFriendIds);

        // 2촌 ID 수집
        const secondDegreeIds = new Set<string>();
        firstDegreeUsers.forEach((friend) => {
          const friendsFriends = friend.data.friends || [];
          friendsFriends.forEach((fofId) => {
            if (fofId !== appUser.id && !myFriendIds.includes(fofId)) {
              secondDegreeIds.add(fofId);
            }
          });
        });

        // 2촌 가져오기
        if (secondDegreeIds.size > 0) {
          const secondDegreeUsers = await UserQuery.findByIdIn(Array.from(secondDegreeIds));
          const combinedUsers = [...firstDegreeUsers, ...secondDegreeUsers];
          setAllUsers(combinedUsers);

          const myFriends = combinedUsers.filter((u) => myFriendIds.includes(u.id));
          setFriends(myFriends);

          const allReactions = await TrustQuery.findAll();
          const fof = FofUtils.calculateFOF(appUser, combinedUsers, allReactions);
          setFofUsers(fof);
        } else {
          setFriends(firstDegreeUsers);
        }
      } catch (error) {
        console.error('데이터 로딩 오류:', error);
      }
    };

    loadData();
  }, [appUser]);

  // 검색으로 위치 이동
  const handleLocationSelect = (lat: number, lng: number) => {
    setMapCenter([lat, lng]);
  };

  // 위치 저장 (도시 검색으로 설정한 경우)
  const handleLocationSave = async (lat: number, lng: number, cityName: string) => {
    if (!appUser) return;

    try {
      await UserQuery.updateLocation(appUser.id, { lat, lng, cityName });
      setMyLocation([lat, lng]);
      setMapCenter([lat, lng]);
      setLocationPermissionDenied(false);
      console.log('위치 저장 완료:', { lat, lng, cityName });
    } catch (error) {
      console.error('위치 저장 오류:', error);
      alert('위치 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="pb-[70px]">
      <Header>
        <div className="max-w-sm mx-auto px-4 py-4 flex items-center justify-center">
          <div className="text-2xl font-bold text-stone-800 font-logo">Map</div>
        </div>
      </Header>

      {/* 위치 권한 거부 시에만 검색창 표시 */}
      {locationPermissionDenied && (
        <LocationSearchBar
          onLocationSelect={handleLocationSelect}
          onLocationSave={handleLocationSave}
          showSaveButton={true}
        />
      )}

      {locationPermissionDenied && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <p className="font-bold">위치를 직접 선택하거나 도시를 검색해주세요</p>
          <p className="text-sm">위치 권한이 거부되었거나 사용할 수 없습니다.</p>
        </div>
      )}

      {friends.length === 0 && fofUsers.length === 0 && (
        <div className="text-center py-8 text-gray-500">표시할 유저가 없습니다</div>
      )}

      <div className="h-[calc(100vh-200px)]">
        <MapContainer center={mapCenter} zoom={DEFAULT_ZOOM} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapCenterUpdater center={mapCenter} />

          {/* 내 위치 마커 */}
          {appUser && (
            <Marker position={myLocation} icon={createProfileMarker(appUser.data.avatar, '#ef4444', true)}>
              <Popup>
                <div className="text-center">
                  <strong>내 위치</strong>
                  <br />
                  {appUser.data.name}
                  {appUser.data.geo?.cityName && (
                    <>
                      <br />
                      <span className="text-xs text-gray-500">{appUser.data.geo.cityName}</span>
                    </>
                  )}
                </div>
              </Popup>
            </Marker>
          )}

          {/* 1촌 친구 마커 (파란색 반경) */}
          {friends.map((friend) => {
            if (!friend.data.geo) return null;

            const position: LatLngExpression = [friend.data.geo.lat, friend.data.geo.lng];

            return (
              <div key={friend.id}>
                <Circle
                  center={position}
                  radius={3000}
                  pathOptions={{
                    color: '#3b82f6',
                    fillColor: '#3b82f6',
                    fillOpacity: 0.2,
                  }}
                />
                <Marker position={position} icon={createProfileMarker(friend.data.avatar, '#3b82f6')}>
                  <Popup>
                    <div className="text-center">
                      <img src={friend.data.avatar} alt={friend.data.name} className="w-12 h-12 rounded-full mx-auto mb-2" />
                      <strong>{friend.data.name}</strong>
                      <br />
                      <span className="text-sm text-gray-600">1촌 친구</span>
                      {friend.data.geo.cityName && (
                        <>
                          <br />
                          <span className="text-xs text-gray-500">{friend.data.geo.cityName}</span>
                        </>
                      )}
                    </div>
                  </Popup>
                </Marker>
              </div>
            );
          })}

          {/* 2촌(FOF) 마커 (신뢰도별 색상) */}
          {fofUsers.map((fof) => {
            if (!fof.user.data.geo) return null;

            const position: LatLngExpression = [fof.user.data.geo.lat, fof.user.data.geo.lng];
            const color = FofUtils.getMarkerColor(fof.trustScore);

            return (
              <div key={fof.user.id}>
                <Circle
                  center={position}
                  radius={3000}
                  pathOptions={{
                    color,
                    fillColor: color,
                    fillOpacity: 0.3,
                  }}
                />
                <Marker position={position} icon={createProfileMarker(fof.user.data.avatar, color)}>
                  <Popup>
                    <div className="text-center">
                      <img src={fof.user.data.avatar} alt={fof.user.data.name} className="w-12 h-12 rounded-full mx-auto mb-2" />
                      <strong>{fof.user.data.name}</strong>
                      <br />
                      <span className="text-sm text-gray-600">2촌 친구</span>
                      <br />
                      <span className="text-xs text-gray-500">공통 친구 {fof.mutualFriendsCount}명</span>
                      {fof.user.data.geo.cityName && (
                        <>
                          <br />
                          <span className="text-xs text-gray-500">{fof.user.data.geo.cityName}</span>
                        </>
                      )}
                      <br />
                      <span className="text-xs">{fof.trustLabel}</span>
                    </div>
                  </Popup>
                </Marker>
              </div>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};
