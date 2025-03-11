export const fetchData = async (): Promise<{ message: string }> => {
    const response = await fetch("/api/data", {
        headers: {
            Accept: "application/json",
        },
    });
    if (!response.ok) throw new Error("Failed to fetch data");
    return response.json();
};
