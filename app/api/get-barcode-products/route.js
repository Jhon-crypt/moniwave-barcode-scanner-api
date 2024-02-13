import { headers } from 'next/headers';

export async function GET(request) {
    const searchParams = request.nextUrl.searchParams

    const barcode = searchParams.get('barcode')

    const product_type = searchParams.get('type');

    // Retrieve the headers from the incoming request
    const headersInstance = headers();

    // Extract the 'authorization' header from the request headers
    const authorization = headersInstance.get('authorization');

    // Split the 'authorization' header to separate the Bearer token
    const splited_authorization = authorization.split("Bearer ");

    // Retrieve the Bearer token from the split result
    const bearer_token = splited_authorization[1];

    if (bearer_token === process.env.auth_bearer_token) {


        if (product_type === 'food') {

            const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/$%7B${barcode}%7D.json`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            const product = await res.json()

            const productBrand = product.product.brands

            const productCategoriesSplitted = product.product.categories

            let productCategoriesArray = productCategoriesSplitted.split(", ");

            let productCategory = productCategoriesArray[0];

            const productImage = product.product.image_front_url
            
            return Response.json({ product })

            //return Response.json({ Barcode: barcode, Name: productBrand, Brand: productBrand, category: productCategory, image: productImage })

            //return Response.json({ 'Type': product_type, 'Barcode': barcode })



        } else if (product_type === 'non_food') {

            const res = await fetch(`https://big-product-data.p.rapidapi.com/gtin/${barcode}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-RapidAPI-Key': process.env.X_RapidAPI_Key,
                    'X-RapidAPI-Host': 'big-product-data.p.rapidapi.com',
                },
            })

            const product = await res.json()

            const productName = product.properties.title[0];

            const productBrand = product.properties.brand;

            const productCategories = product.stores[0].categories[0];

            const productImage = product.stores.map(store => store.image)[0];

            return Response.json({ Barcode: barcode, Name: productName, brand: productBrand , category: productCategories, image: productImage})


        } else {

            return Response.json({ 'Status': 'You need to pass a product type' })

        }

    }
}