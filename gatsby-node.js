const path = require('path');
const fs = require('fs');

// Helper function to generate a slug from a path
const createSlugFromPath = (filePath) => {
  // Extract section and subpage from file path
  // Example: /content/pages/intro/features.md becomes intro/features
  const match = filePath.match(/\/pages\/([^/]+)\/([^/]+)\.md$/);
  if (match) {
    return `${match[1]}/${match[2]}`;
  }
  
  // Handle top-level pages (overview/index pages)
  const topLevelMatch = filePath.match(/\/pages\/([^/]+)\.md$/);
  if (topLevelMatch) {
    return `${topLevelMatch[1]}/index`;
  }
  
  // Fallback
  return path.basename(filePath, '.md');
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;
  
  // Process markdown files
  if (node.internal.type === 'MarkdownRemark') {
    const fileNode = getNode(node.parent);
    const parsedFilePath = path.parse(fileNode.relativePath);
    
    // Generate slug based on file path structure
    const slug = createSlugFromPath(`/pages/${fileNode.relativePath}`);
    
    // Add slug field to node
    createNodeField({
      node,
      name: 'slug',
      value: slug,
    });
    
    // Add section and subpage fields
    const [section, subpage] = slug.split('/');
    createNodeField({
      node,
      name: 'section',
      value: section,
    });
    createNodeField({
      node,
      name: 'subpage',
      value: subpage || 'index',
    });
  }
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const result = await graphql(`
    query {
      allMarkdownRemark {
        nodes {
          fields {
            slug
            section
            subpage
          }
          frontmatter {
            title
          }
          id
        }
      }
    }
  `);

  // Create pages for each markdown file
  result.data.allMarkdownRemark.nodes.forEach(node => {
    // Skip if no slug found
    if (!node.fields || !node.fields.slug) return;
    
    const [section, subpage] = node.fields.slug.split('/');
    
    createPage({
      path: `/page/${node.fields.slug}`,
      component: path.resolve('./src/templates/page-template.js'),
      context: {
        id: node.id,
        slug: node.fields.slug,
        section: section,
        subpage: subpage || 'index',
      },
    });
  });
  
  // Create section index redirects
  // This ensures that /page/intro redirects to /page/intro/index
  const sections = new Set(
    result.data.allMarkdownRemark.nodes
      .filter(node => node.fields && node.fields.section)
      .map(node => node.fields.section)
  );
  
  sections.forEach(section => {
    createPage({
      path: `/page/${section}`,
      component: path.resolve('./src/templates/section-redirect.js'),
      context: {
        section: section,
      },
    });
  });
};