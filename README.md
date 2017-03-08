# Microservices communication with Rabbit MQ 

Install rabbit with 

```
docker run -d --hostname my-rabbit --name rabbitmq -p 15672:15672 -p 5671:5671 -p 5672:5672 rabbitmq:3-management
```

## Pub Sub implemtation:

### Publisher
publish connect to channel 

```
POST / HTTP/1.1
Host: localhost:8001
Content-Type: application/json
Cache-Control: no-cache
Postman-Token: 19c601ce-4f21-82fe-1c58-42375308ebdd

{
"command":
"pub"
}
```
write a message
```
POST / HTTP/1.1
Host: localhost:8001
Content-Type: application/json
Cache-Control: no-cache
Postman-Token: c9fbc0b7-4ede-8229-6e87-a0fe28f9c7a7

{
"command":
"send"
,
"message":
"hi"
}
```

### Subscriber

Listen idle
```
POST / HTTP/1.1
Host: localhost:8002
Content-Type: application/json
Cache-Control: no-cache
Postman-Token: fe4330c9-86b0-dc8a-fbe3-e790da8b7743

{
	"command":
	"sub"
}
```