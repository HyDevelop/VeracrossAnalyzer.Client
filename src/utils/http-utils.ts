import Constants from '@/constants';
import {Token} from '@/components/app/app';

export class HttpUtils
{
    public token: Token;

    constructor (token: Token)
    {
        this.token = token;
    }

    public post(node: string, body: any): Promise<any>
    {
        // Add token
        if (this.token != null)
        {
            body['token'] = this.token.token;
        }

        // Create promise
        return new Promise<any>((resolve, reject) =>
        {
            // Fetch request
            fetch(`${Constants.API_URL}${node}`, {method: 'POST', body: JSON.stringify(body)}).then(res =>
            {
                // Get response body text
                res.text().then(text =>
                {
                    // Parse response
                    let response = JSON.parse(text);
                    resolve(response);
                })
                .catch(reject)
            })
            .catch(reject)
        });
    }
}
