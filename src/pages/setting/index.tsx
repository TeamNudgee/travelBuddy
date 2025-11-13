import { LogoutButton } from './LogoutButton.tsx';
import { Button } from '../../components/ui/button.tsx';
import { useAuth } from '@/contexts/AuthContext.tsx';

interface SettingInterface {
  label: string;
  icon?: React.ReactNode;
}

const appSettings: SettingInterface[] = [
  {
    label: 'Notification',
  },
];

export const SettingPage = () => {
  const { authUser } = useAuth();

  console.log('here');

  return (
    <div className="flex flex-col gap-3 bg-white min-h-[calc(100vh-106px)] px-3">
      {authUser && (
        <div className="flex flex-col gap-3 py-1 bg-white">
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight ">Account</h3>
          <Button
            variant="ghost"
            className="h-[36px] w-full flex justify-between items-center gap-3 px-2 text-black rounded-none hover:bg-gray-100 hover:cursor-pointer"
          >
            <span>Login Info</span>
            <span className={'text-gray-400'}>{authUser.email}</span>
          </Button>
          <LogoutButton />
          <Button
            variant="ghost"
            className="h-[36px] flex items-center gap-3 justify-start px-2 text-black rounded-none hover:bg-gray-100 hover:cursor-pointer"
          >
            <span>탈퇴</span>
          </Button>
          {/* {accountSettings.map((setting) => {
          return (
            <>
              <Button variant='ghost' className="h-[36px] flex items-center gap-3 justify-start px-0 text-black rounded-none hover:bg-gray-100 hover:cursor-pointer">
                {/* {setting.icon}
                <span>{setting.label}</span>
              </Button>
            </>
          );
        })} */}
        </div>
      )}
      <div className="flex flex-col gap-3 py-1 bg-white">
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight ">App Settings</h3>
        {appSettings.map((setting) => {
          return (
            <>
              <Button
                variant="ghost"
                className="h-[36px] flex items-center gap-3 justify-start px-2 text-black rounded-none hover:bg-gray-100 hover:cursor-pointer"
              >
                {/* {setting.icon} */}
                <span>{setting.label}</span>
              </Button>
            </>
          );
        })}
      </div>
    </div>
  );
};
