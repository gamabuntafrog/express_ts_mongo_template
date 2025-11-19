import { Request } from 'express';
import { ObjectSchema } from 'joi';
import { ValidationError } from '../errors/AppError';
import { ERROR_CODES } from '../constants/errorCodes';

class Mapper {
  /**
   * Map request data to DTO using Joi schema for validation and sanitization
   * Combines body, params, and query into one object for validation
   * @param req - Express request object
   * @param schema - Joi validation schema
   */
  public toDTO<T = any>(req: Request, schema: ObjectSchema): T {
    // Combine all request data into one object
    const dataToValidate = {
      ...req.body,
      ...req.params,
      ...req.query
    };

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      // Get message from first error detail
      const firstErrorMessage = error.details[0]?.message || 'Validation failed';

      throw new ValidationError(firstErrorMessage, ERROR_CODES.VALIDATION_ERROR);
    }

    // Update request object with normalized values
    // Separate back into body, params, and query based on what was in original request
    const normalizedBody: any = {};
    const normalizedParams: any = {};
    const normalizedQuery: any = {};

    // Check original keys to determine where to put normalized values
    Object.keys(value).forEach(function(key) {
      if (key in req.params) {
        normalizedParams[key] = value[key];
      } else if (key in req.query) {
        normalizedQuery[key] = value[key];
      } else {
        normalizedBody[key] = value[key];
      }
    });

    // Update request object
    Object.assign(req.body, normalizedBody);
    Object.assign(req.params, normalizedParams);
    Object.assign(req.query, normalizedQuery);

    return value as T;
  }
}

// Export singleton instance
export default new Mapper();

