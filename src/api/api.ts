const baseUrl = "https://jsonplaceholder.typicode.com/"

export const postUsers = (
    body: string,
    endPoint: string
): any => {
    return fetch(`${baseUrl}${endPoint}`, {
        method: "POST",
        body: body,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            authorization: "very_secret_token"
        }
    })
        .then(res => res)
        .catch(err => {
            showError(err, 'network error!!!')
        })
}

export const getUsers = (
    endPoint: string
): any => {
    return fetch(`${baseUrl}${endPoint}`)
        .then(res => res)
        .catch(err => {
            showError(err, 'network error!!!')
        })

}

export const showError = (errorCode:number, errorMessage:string) => {
    alert(errorMessage)
    console.log(`ERROR CODE ${errorCode}`)
}