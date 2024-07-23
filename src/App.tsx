import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import "dayjs/locale/zh-tw";
import axios from "axios";
import { useEffect, useState } from "react";

// pages
import Home from "./pages/Home";
import TableActionRecorder from "./pages/TableActionRender";
import Table from "./pages/Table";

// Components
import MandarinVer from "./pages/MandarinVer";
import Layout from "./Layouts/Layout";

// antd types
import zhTW from "antd/locale/zh_TW";

function App() {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get("/api/getNtFormData").then((res) => {
            setData(res.data.data);
        });
    }, []);

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
                                path="/table"
                                element={<Table data={data} />}
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
