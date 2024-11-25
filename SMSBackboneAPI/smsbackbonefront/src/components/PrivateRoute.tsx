import { Navigate, Outlet } from "react-router-dom";
import Layout from './Layout';

type props = {
    isAllowed: boolean;
    redirectTo: string;
    children: React.ReactNode;
}

const PrivateRoute: React.FC<props> = () => {

    const isLogin = (): boolean => !!localStorage.getItem('token');

    if (!isLogin()) {
        return <Navigate to={"/login"} />;
    }
    return (
        <Layout>
            <Outlet />
        </Layout>
    )
};

export default PrivateRoute