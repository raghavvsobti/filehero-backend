import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import userRoutes from './routes/usersRoutes';
import fileRoutes from './routes/fileRoutes';
import authRoutes from './routes/authRoutes';
import cors, { CorsOptions } from 'cors'; // Import CORS
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

const app = express();

app.use(bodyParser.json());

const corsOptions: CorsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // Allow requests from any origin
        callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
    credentials: true, // Allow cookies and authentication headers
};


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use('/api', userRoutes);
app.use('/file', fileRoutes);
app.use('/auth', authRoutes);


// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the API!');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
