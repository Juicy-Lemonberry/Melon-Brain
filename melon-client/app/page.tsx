import TopNavbar from "@/components/TopNavbar";
import BlogCard from "@/components/BlogCard";
import Footer from "@/components/Footer";

import HorizontalBlogCard from "@/components/HorizontalBlogCard";

import { Box, Container, Typography } from '@mui/material';

const styles = {
  hero: {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1558981852-426c6c22a060?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80')`,
    height: "500px",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    fontSize: "4rem",
    // Use Material-UI breakpoints for responsive styles
    '@media (max-width:600px)': {
      height: 300,
      fontSize: "3rem"
    }
  },
  blogsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  blogTitle: {
    fontWeight: 800,
    paddingTop: 5,
    paddingBottom: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  recentBlog:{
    fontWeight: 800,
    paddingTop: 3,
    paddingBottom: 1,
  }
  ,

  horizontalCard: {
    marginTop: 5
  }
};

export default function Home() {
  return (
    <>

      <TopNavbar />
      <Box sx={styles.hero}>Melon Brain</Box>
      <Typography variant="h4" sx={styles.blogTitle}>
        Trending Blogs
      </Typography>
      <Container sx={styles.blogsContainer}>

        <BlogCard />
        <BlogCard />
        <BlogCard />
        <div >
        <Typography variant="h4" sx={styles.recentBlog} >
          Recent Blogs
        </Typography>
   
        <div className="flex items-center"> 
            <p className="mr-2 prose-lg">Catergory:</p>
            <button className="btn btn-outline glass btn-sm">Food</button>
            <button className="btn btn-outline glass btn-sm">Lifestyle</button>
            <button className="btn btn-outline glass btn-sm ">Technology</button>
            </div>
          </div>
          <div className="flex items-center"> 
          <div className="join">
  <div>
    <div>
      <input className="input input-bordered join-item bg-white text-black" placeholder="Melon Brain"/>
    </div>
  </div>
  <div className="indicator">
    <button className="btn join-item input-bordered bg-white text-black">Search</button>
  </div>
</div>
</div>
        

        <HorizontalBlogCard />
        <HorizontalBlogCard />
        <HorizontalBlogCard />
      </Container>
      <Footer />
    </>
  );
}
