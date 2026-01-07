// src/modulos/categories/category.swagger.ts

import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiParam,
  ApiOperation,
  ApiBody,
} from '@nestjs/swagger';
import { Category } from '../entities/category.entity';
import { CategoryDto } from '../dto/category.dto';

// Puedes definir ejemplos si quieres, pero los omitimos aquí por simplicidad
// Si los tienes, ¡agrégalos!

export function ApiCategoryFindAll() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtener todas las categorías',
      description: 'Devuelve una lista de todas las categorías ordenadas por ID descendente.',
    }),
    ApiOkResponse({
      description: 'Lista de categorías obtenida con éxito.',
      type: [Category],
    }),
    ApiBadRequestResponse({ description: 'Solicitud incorrecta.' }),
  );
}

export function ApiCategoryFindOne() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtener una categoría por ID',
      description: 'Devuelve una categoría específica usando su identificador único.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID de la categoría',
      type: Number,
      example: 1,
    }),
    ApiOkResponse({
      description: 'Categoría encontrada.',
      type: Category,
    }),
    ApiNotFoundResponse({
      description: 'Categoría no encontrada.',
    }),
    ApiBadRequestResponse({
      description: 'ID inválido (debe ser un número entero).',
    }),
  );
}

export function ApiCategoryCreate() {
  return applyDecorators(
    ApiOperation({
      summary: 'Crear una nueva categoría',
      description: 'Registra una nueva categoría. El nombre debe ser único.',
    }),
    ApiBody({ type: CategoryDto }),
    ApiCreatedResponse({
      description: 'Categoría creada con éxito.',
      schema: {
        type: 'object',
        properties: {
          state: { type: 'string', example: 'ok' },
          message: { type: 'string', example: 'Categoría creada exitosamente.' },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'El nombre de la categoría está vacío o es inválido.',
    }),
    ApiConflictResponse({
      description: 'Ya existe una categoría con ese nombre.',
    }),
  );
}

export function ApiCategoryUpdate() {
  return applyDecorators(
    ApiOperation({
      summary: 'Actualizar una categoría existente',
      description: 'Modifica los datos de una categoría identificada por su ID.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID de la categoría a actualizar',
      type: Number,
      example: 1,
    }),
    ApiBody({ type: CategoryDto }),
    ApiOkResponse({
      description: 'Categoría actualizada con éxito.',
      schema: {
        type: 'object',
        properties: {
          state: { type: 'string', example: 'ok' },
          message: { type: 'string', example: 'Categoría actualizada exitosamente.' },
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Categoría no encontrada.',
    }),
    ApiBadRequestResponse({
      description: 'ID inválido o nombre de categoría vacío.',
    }),
    ApiConflictResponse({
      description: 'Ya existe otra categoría con ese nombre.',
    }),
  );
}

export function ApiCategoryDelete() {
  return applyDecorators(
    ApiOperation({
      summary: 'Eliminar una categoría',
      description: 'Elimina una categoría por su ID. No se puede eliminar si tiene productos asociados.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID de la categoría a eliminar',
      type: Number,
      example: 1,
    }),
    ApiOkResponse({
      description: 'Categoría eliminada con éxito.',
      schema: {
        type: 'object',
        properties: {
          state: { type: 'string', example: 'ok' },
          message: { type: 'string', example: 'Categoría eliminada exitosamente.' },
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Categoría no encontrada.',
    }),
    ApiBadRequestResponse({
      description: 'ID inválido.',
    }),
    ApiConflictResponse({
      description: 'No se puede eliminar la categoría porque tiene productos asociados.',
    }),
  );
}