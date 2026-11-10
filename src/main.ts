import './style.css';
import { mountApp } from './app';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('App root not found');
void mountApp(app);
