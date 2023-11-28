# 1. Try to POST a new text fragment as an authorized user
POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
Content-Type: text/plain
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Body of the request goes in ```...``` when it's a string
`Hello S3!`

# 2. We expect to get back an HTTP 201
HTTP/1.1 201
[Asserts]
# The Location header should look like what we expect (including the fragment id)
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
# Capture the Location URL into a variable named `url`
[Captures]
url: header "Location"

# 3. Try to GET the fragment we just posted by its URL
GET {{url}}
[BasicAuth]
user1@email.com:password1

# 4. We expect to get back an HTTP 200 with text/plain and content-length 9
HTTP/1.1 200
Content-Type: text/plain
Content-Length: 9
[Asserts]
#We expect the body to match what was sent in - 'Hello S3!'
body == "Hello S3!"

# 5. Try to DELETE the fragment we just posted by its URL
DELETE {{url}}
[BasicAuth]
user1@email.com:password1

# 6. We expect to get back an HTTP 200
HTTP/1.1 200

# 7. Try to GET the fragment we just deleted by its URL
GET {{url}}
[BasicAuth]
user1@email.com:password1

# 8. We expect to get back an HTTP 404, since the fragment is deleted
HTTP/1.1 404