import { Outlet } from "react-router-dom";

export default function Home() {
    return (
        <>
            <div>Home Page</div>
            <Outlet />
        </>
    );
}
