import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import { conectarBanco, sql } from './database.js';

const app = express();
const ai = new GoogleGenAI({});