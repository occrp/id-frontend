export default function() {
  this.namespace = '/api';

  this.get('/tickets', (schema) => {
    return schema.tickets.all();
  });
}
