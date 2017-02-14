export default function() {
  this.namespace = '/api';

  this.get('/tickets', (schema) => {
    return schema.tickets.all();
  });

  this.get('/tickets/:id', (schema, request) => {
    let id = request.params.id;
    return schema.tickets.find(id);
  });

  this.post('/tickets', (schema, request) => {
    const attrs = JSON.parse(request.requestBody);
    return schema.tickets.create(attrs);
  });
}
