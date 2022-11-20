const requestHandler = (request, response) => {
    const requestObject = {}
    try {
        const headerLimit = request.indexOf('\r\n\r\n');
        const headerBuffer = request.slice(0, headerLimit);
        const splitHeader = headerBuffer.toString().split('\r\n');
        const _body = request.slice(headerLimit+4);
        const splitFirstLineHeader = splitHeader[0].split(' ')
        const headerObject = {
            method: splitFirstLineHeader[0],
            path: splitFirstLineHeader[1],
            httpVer: splitFirstLineHeader[2]
        };

        for (let i = 1; i < splitHeader.length; i++) {
            const parseHeaderData = splitHeader[i].split(':');
            headerObject[`${parseHeaderData[0].trim().toLowerCase()}`] = parseHeaderData[1].trim();
        }

        requestObject['header'] = headerObject;
        requestObject['body'] = _body.toString();
    
        responseHandler(requestObject, response); 
    }
    catch (err) {
        console.log('err request', err);
        errorHandler(500, response, requestObject);
    }
};

const responseHandler = (request, response) => {
           
    try {
        const data = request.body;
        const path = request.header.path;
        const method = request.header.method;
        
        if (path !== '/') {
            return errorHandler(404, response, request);
        }

        if (method === 'POST') {
            if (!data) {
                return errorHandler(400, response, request); 
            }  
            
            const requestBodyLength = request.header['content-length'];
            const bufferResponse = Buffer.from(data).toString('base64');
            response.write(`${request.header.httpVer} 200 OK\r\nServer: http-scratch\r\nContent-Length: ${requestBodyLength}\r\nContent-Type:text/plain\r\n\r\n${bufferResponse}`,() => {
                response.end();
            });
        }
        else if (method === 'GET') {
            response.write(`${request.header.httpVer} 200 OK\r\nServer: http-scratch\r\nContent-Length: 0\r\n\r\n`,() => {
                response.end();
            });
        }
        else {
            return errorHandler(405, response, request);
        }
    }
    catch (err) {
        console.log('err response', err);
        errorHandler(500, response, request)
    }
};

const errorHandler = (errorCode, response, request) => {
    let errorMessage;
    let errorMessageLength;
    
    switch (errorCode) {
        case (400):
            errorMessage = 'BAD REQUEST';
            break;
        
        case (404):
            errorMessage = 'NOT FOUND';
            break;
        
        case (405):
            errorMessage = 'METHOD NOT ALLOWED';
            break;
        default:
            errorMessage = 'INTERNAL SERVER ERROR';
            break;
    }

    errorMessageLength = Buffer.from(errorMessage).length;
    response.write(`${request.header.httpVer} ${errorCode} ${errorMessage}\r\nServer: http-scratch\r\nContent-Length:${errorMessageLength}\r\n\r\n${errorMessage}`, () => {
        response.end();
    });
};


module.exports = {
    requestHandler
};