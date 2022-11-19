const requestHandler = (request, response) => {
    const requestObject = {}
    try {
        const headerLimit = request.indexOf('\r\n\r\n');
        const headerBuffer = request.slices(0, headerLimit);
        const splitHeader = headerBuffer.toString().split('\r\n');
        const _body = request.slice(headerLimit+4);
        const headerObject = {
            method: splitHeader[0].split(' ')[0],
            path: splitHeader[0].split(' ')[1],
            httpVer: splitHeader[0].split(' ')[2]
        };

        for (let i = 1; i < splitHeader.length; i++) {
            const parseHeaderData = splitHeader[i].split(':');
            headerObject[`${parseHeaderData[0].trim().toLowerCase()}`] = parseHeaderData[1].trim();
        }

        requestObject['header'] = headerObject;
        requestObject['body'] = _body.toString();
    
        response.write(`${requestObject.header.httpVer} `);
        responseHandler(requestObject, response);
    }
    catch (err) {
        console.log('errord request', err);
        response.write('HTTP/1.1 ');
        errorHandler(500, response);
    }
};

const responseHandler = (request, response) => {
    try {
        const data = request.body;
        if (!data) {
            errorHandler(400, response);
        }
        else {
            const requestBodyLength = request.header['content-length'];
            const bufferResponse = Buffer.from(data).toString('base64');
            response.write(`200 OK\r\nServer: http-scratch\r\nContent-Length: ${requestBodyLength}\r\nContent-Type:text/plain\r\n\r\n${bufferResponse}`);
            response.end();
        }
        
    }
    catch (err) {
        console.log('errord response', err);
        response.write('HTTP/1.1 ');
        errorHandler(500, response);
    }
};

const errorHandler = (errorCode, response) => {
    let errorMessage;
    let errorMessageLength;

    if (errorCode === 400) {
        errorMessage = 'BAD REQUEST';
        errorMessageLength = Buffer.from(errorMessage).length;
    }
    else {
        errorMessage = 'INTERNAL SERVER ERROR';
        errorMessageLength = Buffer.from(errorMessage).length;
    }
    response.write(`${errorCode} ${errorMessage}\r\nServer: http-scratch\r\nContent-Length:${errorMessageLength}\r\n\r\n${errorMessage}`);
    response.end();
    
};


module.exports = {
    requestHandler
};