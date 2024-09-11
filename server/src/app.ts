import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from the root route!');
});

// Example route
app.get('/', (req: Request, res: Response) => {
    res.send('Hello from the root route!');
  });
  

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
