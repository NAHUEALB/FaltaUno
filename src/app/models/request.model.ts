export class Request{
    items: Item[] = []
}

export class Item{
            title: String;
            description: String;
            picture_url: String;
            category_id: String;
            quantity: number;
            currency_id: String;
            unit_price: number;
}


export class Response{
    sandbox_init_point: String;
}