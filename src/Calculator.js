import React, { Component } from 'react';
import Request from 'superagent-bluebird-promise';

const ENDPOINT_URL_BASE = 'http://wp8m3he1wt.s3-website-ap-southeast-2.amazonaws.com';
const ENDPOINT_RELATIVE_FIRST = '/api/products/1';

export default class Calculator extends Component {
  constructor () {
    super();

    this.state = {
      products: [],
      loading: false,
    };
  }

  componentWillMount () {
    this.fetchProducts();
  }

  fetchProducts (target) {
    let { products, loading } = this.state;
    let slug = !!target ? target : ENDPOINT_RELATIVE_FIRST;

    this.setState({
      ...this.state,
      loading: true,
    });

    return Request
      .get(`${ENDPOINT_URL_BASE}${slug}`)
      .then((res) => {
        let data = res.body;
        this.setState({
          ...this.state,
          products: [ ...products, ...data.objects ],
        });

        !!data.next
          ? this.fetchProducts(data.next)
          : this.setState({ loading: false });
      });
  }

  getCubicWeight(p) {
    const { width, length, height } = p.size;
    return parseFloat(width)/100 * parseFloat(length)/100 * parseFloat(height)/100 * 250;
  }

  getProductsByCategory(category) {
    const { products } = this.state;
    return products.filter((p) => { return p.category === category; });
  }

  getAverageCubicWeight(category) {
    const { loading } = this.state;
    const filteredProducts = this.getProductsByCategory(category);
    const totalCubicWeight = filteredProducts.reduce((subtotal, p) => { return subtotal + this.getCubicWeight(p) }, 0);

    return totalCubicWeight/filteredProducts.length;
  }

  render () {
    let { loading } = this.state;
    let category = "Air Conditioners";
    let filteredProducts = this.getProductsByCategory(category);

    return <div>
            <h1>Cubic Weight Calculator</h1>
            <h2>Average Cubic Weight: { !loading ? `${this.getAverageCubicWeight(category)} kg` : "Calculating..." }</h2>

            <hr />

            <section>
              <h3>Products in "{ category }" category:</h3>
              <ul>
              { filteredProducts.map((p, i) => {
                  return <li key={`product_${i}`}>
                          <h4>{ p.title }</h4>
                          <div>{ p.size.length }cm x { p.size.width }cm x { p.size.height }cm = { this.getCubicWeight(p) } kg</div>
                        </li>;
                })
              }
              </ul>
            </section>
          </div>;
  }
}
