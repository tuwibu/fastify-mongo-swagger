# fastify + mongoose + swagger example
1. Start CSDL
```
docker compose up -d
```
2. Stop CSDL
```
docker compose down
```
3. Demo JWT
- Để middleware check jwt trong preHandler
4. Cách sử dụng CSDL
```
fastify.model.User.create
```
5. Cách handle Error
```
throw new fastify.httpErrors.Conflict(`User already exists: ${username}`);
```