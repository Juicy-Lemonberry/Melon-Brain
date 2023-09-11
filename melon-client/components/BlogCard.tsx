import React from 'react';
import { Grid, Card, CardActionArea, CardMedia, CardContent, CardActions, Typography, Avatar, Box } from '@mui/material';

const styles = {
    card: {
        width: '30%',
        marginBottom: '20px',
        flexBasis: 'calc(30% - 20px)'
      
    },
    media: {
      height: 240,
    },
    cardActions: {
      display: "flex",
      margin: "0 10px",
      justifyContent: "space-between",
    },
    author: {
      display: "flex",
    },
    paginationContainer: {
      display: "flex",
      justifyContent: "center",
    },
  };
const BlogCard= () => {
    return (

          <Card sx={styles.card}>
            <CardActionArea>
              <CardMedia
                sx={styles.media}
                image="https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                title="Contemplative Reptile"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  React useContext
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                  across all continents except Antarctica
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions sx={styles.cardActions}>
              <Box sx={styles.author}>
                <Avatar src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" />
                <Box ml={2}>
                  <Typography variant="subtitle2" component="p">
                    Guy Clemons
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary" component="p">
                    May 14, 2020
                  </Typography>
                </Box>
              </Box>
              <Box>

              </Box>
            </CardActions>
          </Card>

    );
};

export default BlogCard;