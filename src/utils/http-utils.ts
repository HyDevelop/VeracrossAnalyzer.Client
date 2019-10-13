import Constants from '@/constants';
import {Token} from '@/components/app/app';

export class HttpUtils
{
    public token: Token = null as unknown as Token;
    public csrf: String = '';

    public post(node: string, body: any): Promise<any>
    {
        // Add token
        if (this.token != null)
        {
            body['token'] = this.token.token;
            body['username'] = this.token.user;
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
