import { Navigate, Outlet } from "react-router-dom";
import AutentificationLayout from "./AutentificationLayout";

type props = {
    isAllowed: boolean;
    redirectTo: string;
    children: React.ReactNode;
}

const AutentificationRoute: React.FC<props> = () => {

    const isLogin = (): boolean => !!localStorage.getItem('token');

    if (!isLogin()) {
        return <Navigate to={"/login"} />;
    }
    return (
        <AutentificationLayout>
            <Outlet />
        </AutentificationLayout>
    )
};

export default AutentificationRoute