const FormatError = (msg, status) => {
    return {
        type: "error",
        msg: msg,
        ErrorCode: status
    }
}//FormatError

const FormatSuccess = (msg, obj = null) => {
    if (obj) {
        return {
            type: "success",
            msg: msg,
            data: obj
        }
    } else {
        return {
            type: "success",
            msg: msg
        }
    }
}//FormatSucces

const FormatObject = (obj) => {
    return obj;
}//FormatObject

module.exports = { FormatError: FormatError, FormatSuccess: FormatSuccess, FormatObject: FormatObject };