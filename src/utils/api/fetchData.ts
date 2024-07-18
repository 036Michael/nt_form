import { useState, useEffect } from "react";
import useAxios from "axios-hooks";

export const fetchData = (url: string) => {
    const [{ data, loading, error }, refetch] = useAxios(url);
    const [fetchedData, setFetchedData] = useState(null);

    useEffect(() => {
        if (loading) {
            console.log("loading...");
        } else if (error) {
            console.error("error", error);
        } else {
            console.log("data", data);
            setFetchedData(data);
        }
    }, [data, loading, error]);

    return { data: fetchedData, loading, error, refetch };
};
