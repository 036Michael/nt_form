import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
// pages
import Home from "./pages/Home";

// Components
import MandarinVer from "./Components/MandarinVer";
import Layout from "./Layouts/Layout";

// types
import zhCN from "antd/locale/zh_CN";

import "dayjs/locale/zh-cn";

function App() {
    return (
        <>
            <ConfigProvider locale={zhCN}>
                <Router>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route
                                path="/flowcontrlNtforms"
                                element={<MandarinVer />}
                            />

                            <Route
                                path="*"
                                element={<div>404 Not Found</div>}
                            />
                        </Routes>
                    </Layout>
                </Router>
            </ConfigProvider>
        </>
    );
}

export default App;
