export interface IProduct {
    id: string | number; // Assuming id can be a string or a number
    localizeInfos: { title: string }; // Assuming title is a string
    price: number; // Assuming price is a number
    attributeValues: {
        p_image: {
            value: {
                downloadLink: string; // Correct type for downloadLink
            };
        };
        p_title: {
            value: string; // Assuming title is a string
        };
        // Add other attributes as needed, like p_currency, p_description, etc.
    };
}