/** @type {import('./$types').RequestHandler} */
export async function GET({ url, fetch }) {
    const filter = url.searchParams.get('filter');
    console.log("filter", filter);
    let query = filter ? `http://test-api.arniva.cloud/v1/banka?filter=${filter}` : 'http://test-api.arniva.cloud/v1/banka';
    console.log("query", query);
    const res = await fetch(`${query}`);

    console.log("res", res);



    if (!res.ok) {
        return new Response(null, {
            status: res.status,
            statusText: res.statusText,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store",
                "Access-Control-Allow-Origin": "*"
            }
        });
    }
    const jsonData = await res.json();
    console.log("jsonData", jsonData);
    let data = []
    if(jsonData.data.length) {
        data = jsonData.data.map((item) => {
            console.log("----------------------------------");
            console.log("item", item);
            console.log("----------------------------------");

            return {
                name: item.adi,
                ...item
            }
        });
    }
    console.log("data", data);
    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
            "Access-Control-Allow-Origin": "*"
        }
    });
};