import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import "dayjs/locale/zh-tw";

// pages
import Home from "./pages/Home";
import TableActionRecorder from "./pages/TableActionRender";

// Components
import MandarinVer from "./pages/MandarinVer";
import Layout from "./Layouts/Layout";

// antd types
import zhTW from "antd/locale/zh_TW";

function App() {
    return (
        <>
            <ConfigProvider
                locale={zhTW}
                theme={{
                    components: {
                        Form: {},
                        Table: {
                            borderRadiusOuter: 10,
                            borderColor: "#dddddd",
                        },
                        Button: {
                            paddingContentHorizontal: 28,
                            paddingContentVertical: 20,
                        },
                    },

                    token: {
                        fontSize: 22,
                        // paddingContentHorizontal: 28,
                    },
                }}
            >
                <Router>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route
                                path="/flowcontrlNtforms"
                                element={<MandarinVer />}
                            />
                            <Route
                                path="/englishVer"
                                element={<TableActionRecorder />}
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
