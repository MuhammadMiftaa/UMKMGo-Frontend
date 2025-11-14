import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.1,
});

export const startProgress = () => {
  NProgress.start();
};

export const stopProgress = () => {
  NProgress.done();
};

export const incrementProgress = () => {
  NProgress.inc();
};

export default NProgress;
