import 'dotenv/config';
import start from './startServer';
const { PORT } = process.env;

if(!PORT) {
    console.error('PORT not found!');
} else {
    if (!Number.isNaN(+PORT)) {
        start(+PORT);
    } else {
        console.error('PORT value must be a number.');
    }
};


