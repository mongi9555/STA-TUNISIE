import { pgTable, serial, text, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table (integrating with Firebase Auth UID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID or internal commercial UID
  email: text('email').notNull(),
  name: text('name').notNull(),
  phone: text('phone'),
  agency: text('agency'),
  role: text('role').notNull().default('commercial'), // 'super_admin' | 'admin' | 'commercial'
  avatar: text('avatar'),
  quotaPerModel: integer('quota_per_model').default(5),
  permissions: jsonb('permissions'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Vehicle Models Table
export const carModels = pgTable('car_models', {
  id: text('id').primaryKey(), // Model ID e.g. "tiggo_2_pro"
  name: text('name').notNull(),
  category: text('category').notNull(),
  priceTND: integer('price_tnd').notNull(),
  requiredDepositTND: integer('required_deposit_tnd').default(5000),
  registrationFeeTND: integer('registration_fee_tnd').default(0),
  engine: text('engine').notNull(),
  transmission: text('transmission').notNull(),
  energy: text('energy').notNull(),
  guarantee: text('guarantee').notNull(),
  imageUrl: text('image_url').notNull(),
  colors: jsonb('colors').notNull(),
  interiorColors: jsonb('interior_colors'),
  features: jsonb('features').notNull(),
  description: text('description').notNull(),
  ficheTechniqueUrl: text('fiche_technique_url'),
  consumption: text('consumption'),
  powerHP: text('power_hp'),
  torque: text('torque'),
  dimensions: text('dimensions'),
  bootCapacity: text('boot_capacity'),
  maxSpeed: text('max_speed'),
  acceleration: text('acceleration'),
  galleryImages: jsonb('gallery_images'),
  safetyFeatures: jsonb('safety_features'),
  interiorOptions: jsonb('interior_options'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Reservations Table
export const reservations = pgTable('reservations', {
  id: text('id').primaryKey(), // e.g. "RES-2026-0810-001"
  commercialId: text('commercial_id').notNull(),
  commercialName: text('commercial_name').notNull(),
  agency: text('agency').notNull(),
  carId: text('car_id').notNull(),
  carName: text('car_name').notNull(),
  colorName: text('color_name').notNull(),
  interiorColorName: text('interior_color_name'),
  totalPriceTND: integer('total_price_tnd').notNull(),
  depositAmountTND: integer('deposit_amount_tnd').notNull(),
  paymentMethod: text('payment_method').notNull(), // 'especes' | 'cheque' | 'virement' | 'leasing'
  paymentStatus: text('payment_status').notNull(), // 'Acompte Payé' | 'Payé Intégralement' | 'En attente de règlement' | 'Chèque de réservation'
  status: text('status').notNull(), // 'Active' | 'Livrée' | 'Annulée'
  clientInfo: jsonb('client_info').notNull(),
  documents: jsonb('documents'),
  optionsSelected: jsonb('options_selected'),
  note: text('note'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Stock Requests Table
export const stockRequests = pgTable('stock_requests', {
  id: text('id').primaryKey(),
  commercialId: text('commercial_id').notNull(),
  commercialName: text('commercial_name').notNull(),
  commercialAgency: text('commercial_agency'),
  carId: text('car_id').notNull(),
  carName: text('car_name').notNull(),
  requestedQuantity: integer('requested_quantity').notNull(),
  reason: text('reason'),
  status: text('status').notNull().default('En attente'),
  createdAt: timestamp('created_at').defaultNow(),
  processedAt: timestamp('processed_at'),
  adminNote: text('admin_note'),
});

// App Settings Table
export const siteSettings = pgTable('site_settings', {
  key: text('key').primaryKey().default('global'),
  data: jsonb('data').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// User Relations
export const usersRelations = relations(users, ({ many }) => ({
  reservations: many(reservations),
}));
