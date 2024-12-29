export const getAPI = async (url: string, option: RequestInit) => {
    const response = await fetch(url, option);
    if (response.ok) {
        const data = await response.json();
        return data;
    }
    throw 'Error In Fetching API';
}