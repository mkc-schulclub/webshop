# * Contains integer enum for internal API Status Codes
# These are not the response status codes, but the ones
# Contained in the response data

from enum import IntEnum

class statusCodes(IntEnum):
    SUCCESS             = 100   # * Everything works nicely :+1:
    NOT_FOUND           = 600   # * Raised when an Item does not Exist but is expected to
    WRONG_PASS_OR_NAME  = 601   # * Raised when the login password or name are incorrect
    ITEM_EXISTS         = 602   # * Raised when an Item already exists
    INVALID_SIGNATURE   = 603   # * Raised when the request Signatures are wrong or missing
    INVALID_SESSION     = 604   # * Raised when the request session is missing or invalid
    PDF_UNAVAILABLE     = 605   # * Raised when the server cant communicate with zipline to upload
    TOO_MANY_ITEMS      = 9001  # * Raised when a certain amount of Items are expected but too many or too litle are sent
    INVALID_BODY        = 606   # * Raised when the body is misformed and certain keys or values are wrong types or missing
    MISSING_PERMISSIONs = 607   # * Raised when a user tries to call an endpoint which is admin only