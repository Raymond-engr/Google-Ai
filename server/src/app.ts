import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import errorHandler from './middleware/errorHandler';
import notFound from './middleware/notFound';

const app: Application = express();

 {/* const helmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'trusted.com'],
    },
  },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' },
  hsts: { maxAge: 31536000 },
  hidePoweredBy: { setTo: 'Django' },
  referrerPolicy: { policy: 'no-referrer' },
  noSniff: true,
}; */}

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ['GET'],
  optionsSuccessStatus: 200
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

export default app;