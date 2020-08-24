import React, { Component } from 'react';
import { Container, Box, Heading, Card, Image, Text, SearchField, Icon} from 'gestalt';
import { Link } from 'react-router-dom'
import Strapi from 'strapi-sdk-javascript/build/main';
import './App.css';
import { ScaleLoader } from 'react-spinners';

//api url
const apiUrl = process.env.API_URL || 'http://localhost:1337';
// strapi contstructor
const strapi = new Strapi(apiUrl);

//app component
class App extends Component {
  state = {
    brands: [],
    searchTerm: '',
    loadingBrands: true
  }


  async componentDidMount() {
    try {
      const res = await strapi.request('POST', '/graphql', {
        data: {
                query: `query {
                  brands{
                    _id
                    name
                    description
                    image{
                      url
                    }
                  }
                }`
              }
      });
      //console.log(res)
      this.setState({
        brands: res.data.brands,
        loadingBrands: false
      })
    } catch (error) {
      console.error(error)
      this.setState({ loadingBrands: false})
    }

    
  }

  //search input field
  handleChange = ({value}) => {
    this.setState ({
      searchTerm: value
    })
  }

  //filtered brands 
  filteredBrands = ({searchTerm, brands }) => {
    return brands.filter(brand => {
      return brand.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      brand.description.toLowerCase().includes(searchTerm.toLowerCase())
    });
  }
  
  render() {
    const {searchTerm, loadingBrands } = this.state;
    /*search field testing
    const hello = 'Goose Island'
    console.log(this.state.brands.filter(brand => brand.name.toLowerCase().includes(hello.toLocaleLowerCase())));*/
    return (
      <Container>
        {/*Brand search field */}
        <Box
          display="flex"
          justifyContent="center"
          marginTop={4}
        >
          <SearchField 
            id="searchField"
            accessibilityLabel="Brands Search Field"
            onChange={this.handleChange}
            placeholder="search your brand..."
            value={searchTerm}
          />
          <Box margin={3}>
            <Icon 
              icon="filter"
              color={searchTerm ? 'orange' : 'gray'}
              size={20}
              accessibilityLabel="Filter"
            />
          </Box>
        </Box>

        {/*Brands Section*/}
        <Box
        display="flex"
        justifyContent="center"
        marginBottom={2}
        >
        {/*Brands Header*/}
        <Heading 
        color="midnight" 
        size="md"
        alignItems="center"
        >
          Brew Brands
        </Heading>
        </Box>

        {/*Brands */}
        <Box
          dangerouslySetInlineStyle={{
            __style: {
              backgroundColor:'#ffffff'
            }
          }}
          shape="rounded"
          wrap display="flex"
          justifyContent="around"
        >
          {this.filteredBrands(this.state).map(brand => (
            <Box 
              margin={2}
              paddingY={2}
              width={200}
              key={brand._id}
            >
              <Card
                
                image={
                  <Box height={200} width={200}>
                    <Image 
                      fit="cover"
                      alt="Brand Image"
                      naturalHeight={1}
                      naturalWidth={1}
                      src={`${apiUrl}${brand.image.map(image => image.url)}`}/>
                  </Box>
                }
              >
                {/**texts on the card */}
                <Box 
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  direction="column"
                >
                  <Text bold size="xl">{ brand.name}</Text>
                  <Box  margin={2} padding={2} justifyContent="center">
                    <Text bold color="pine">{ brand.description}</Text>
                  </Box>
                  <Text bold size="xl">
                    <Link to={`${brand._id}`} >See Brews</Link>
                  </Text>
                </Box>
              </Card>
            </Box>
          ))}
        </Box>
          <Box
            position="fixed"
            dangerouslySetInlineStyle={{
                __style: {
                    bottom: 300,
                    left: '50%',
                    transform: "translateX(-50%)"
    
                }
            }}>
            {loadingBrands && <ScaleLoader />}
          </Box>
          
      </Container>
    );
  }
}

export default App;
