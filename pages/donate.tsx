import React, { useState } from 'react';
import Stripe from 'stripe';
import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import axios from 'axios';
import AnimatePage from '../components/utils/AnimatePage';
import { useLocale } from '../translations/useLocale';
import MetaTags from '../components/utils/MetaTags';
import vercel from '../public/vercel.svg';

interface IPrice extends Stripe.Price {
}

interface IProps {
   prices: IPrice[]
}

const DonatePage = ({prices}: IProps) => {
   const [ amount, setAmount ] = useState<string | number>('1');
   const l = useLocale();
   const [ isDonateLoaderVisible, setIsDonateLoaderVisible ] = useState(false);
   const [ dots, setDots ] = useState('');

   const handleDonate = async () => {
      let intervalID;
      try {
         intervalID = setInterval(() => setDots(prevState => prevState + '.'), 350);
         const res = await axios.post('/api/payment', {
            items: [
               {id: 1, quantity: 2},
               {id: 2, quantity: 1},
            ],
            donation: amount,
         });
         window.location = res.data.url;
         clearInterval(intervalID);
         setDots('');
      } catch (e) {
         clearInterval(intervalID)
         setDots('');
         setIsDonateLoaderVisible(false);
         console.warn(e)
      }
   };

   return (
       <AnimatePage>
          <MetaTags title='Donation' desc='Donate to support our work, and enhance your life' imagePath={vercel} />
          <Container>
             <Typography variant = 'h4' textAlign = 'center'>{l.donationDescription}! ✨
             </Typography>
             <Grid my = {3} justifyContent = 'center' container spacing = {2}>
                <Grid item xs = {9}>
                   <TextField value = {amount} onChange = {e => {
                      setAmount(+e.target.value)
                   }} inputProps = {{min: 1}} type = 'number' fullWidth label = 'Amount, $' placeholder = '1.5'/>
                </Grid>
                <Grid alignItems = 'center' textAlign = 'center' item xs = {4}>
                   <Button onClick = {handleDonate} fullWidth size = 'large' variant = 'contained'>
                      <span style = {{position: 'relative'}}>
                         {`${l.donate}`}
                         <span style = {{position: 'absolute', bottom: '0', right: '0', translate: '100% 0'}}>{`${dots}`}</span>
                      </span>
                   </Button>
                </Grid>
             </Grid>
          </Container>
       </AnimatePage>
   );
};

export default DonatePage;
