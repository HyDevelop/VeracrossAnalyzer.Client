import Constants from '@/constants';
import LoginUser from '@/logic/login-user';

export class HttpUtils
{
    public user: LoginUser;

    public post(node: string, body: any): Promise<any>
    {
        // Add token
        if (this.user != null) body['token'] = this.user.token;

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
