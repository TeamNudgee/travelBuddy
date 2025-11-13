import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationSearchBarProps {
  onLocationSelect: (lat: number, lng: number) => void;
  onLocationSave?: (lat: number, lng: number, cityName: string) => void;
  showSaveButton?: boolean;
}

/**
 * Nominatim API를 사용한 위치 검색 컴포넌트
 * 위치 권한 거부 시 도시 검색으로 위치 설정 가능
 */
export const LocationSearchBar = ({
  onLocationSelect,
  onLocationSave,
  showSaveButton = false,
}: LocationSearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
  } | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    try {
      // Nominatim API로 geocoding (최대 5개 결과)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=5`
      );

      const data: SearchResult[] = await response.json();

      if (data && data.length > 0) {
        setSearchResults(data);
      } else {
        alert('위치를 찾을 수 없습니다. 다시 시도해주세요.');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Location search error:', error);
      alert('위치 검색 중 오류가 발생했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    setSelectedLocation({
      lat,
      lng,
      name: result.display_name,
    });

    // 지도 중심 이동
    onLocationSelect(lat, lng);

    // 검색 결과 초기화
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleSaveLocation = () => {
    if (selectedLocation && onLocationSave) {
      onLocationSave(selectedLocation.lat, selectedLocation.lng, selectedLocation.name);
      alert(`위치가 저장되었습니다: ${selectedLocation.name}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white shadow-md">
      <div className="flex gap-2 p-4">
        <Input
          type="text"
          placeholder="도시나 장소를 검색하세요..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSearching}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()}>
          {isSearching ? '검색 중...' : '검색'}
        </Button>
      </div>

      {/* 검색 결과 목록 */}
      {searchResults.length > 0 && (
        <div className="border-t">
          <div className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-700">
            검색 결과 ({searchResults.length}개)
          </div>
          <ul className="max-h-60 overflow-y-auto">
            {searchResults.map((result, index) => (
              <li
                key={index}
                className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition-colors"
                onClick={() => handleSelectResult(result)}
              >
                <div className="text-sm font-medium text-gray-900">{result.display_name}</div>
                <div className="text-xs text-gray-500">
                  위도: {parseFloat(result.lat).toFixed(4)}, 경도: {parseFloat(result.lon).toFixed(4)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 선택된 위치 표시 및 저장 버튼 */}
      {selectedLocation && showSaveButton && (
        <div className="border-t bg-blue-50 p-4 flex items-center justify-between">
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">선택된 위치</div>
            <div className="text-xs text-gray-600 mt-1">{selectedLocation.name}</div>
          </div>
          <Button onClick={handleSaveLocation} className="ml-4">
            이 위치로 설정
          </Button>
        </div>
      )}
    </div>
  );
};
