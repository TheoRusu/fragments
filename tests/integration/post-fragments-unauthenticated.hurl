# tests/integration/post-fragments-unauthenticated
# Unauthenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
Content-Type: plain/text
# Incorrect HTTP Basic Auth credentials
[BasicAuth]
fake@email.com:password1
# Body of the request goes in ```...``` when it's a string
`This is a fragment!`

# We expect to get back an HTTP 401
HTTP/1.1 401