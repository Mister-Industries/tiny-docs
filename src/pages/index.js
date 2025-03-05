import React from 'react';
import { graphql } from 'gatsby';
import { Helmet } from 'react-helmet';
import Sidebar from '../components/Sidebar';
import ConstellationMap from '../components/ConstellationMap';
import '../styles/global.css';

const IndexPage = ({ data }) => {
  const nodes = data.allMarkdownRemark.nodes;
  
  return (
    <div className="container">
      <Helmet>
        <title>tinyCore Wiki Learning Constellation</title>
      </Helmet>
      <Sidebar />
      <div className="content">
        <ConstellationMap nodes={nodes} />
      </div>
    </div>
  );
};

export const query = graphql`
  query {
    allMarkdownRemark {
      nodes {
        frontmatter {
          title
          slug
          image
        }
        id
        excerpt(pruneLength: 150)
        html
      }
    }
  }
`;

export default IndexPage;

