import useAxios from "axios-hooks";

export const useSearch = (query: object) => {
    const [{ data, loading, error }, refetch] = useAxios({
        url: "/api/mangoSearch",
        method: "POST",
        data: { query },
    });

    // console.log("取回來的資料:", data);

    return { data, loading, error, refetch };
};
