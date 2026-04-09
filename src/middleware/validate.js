/**
 * Wraps a Zod schema into Express middleware.
 * Validates req.body and attaches the parsed result back to req.body.
 */
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    req.body = result.data; // Use the parsed (coerced) data
    next();
  };
}

module.exports = { validate };
