export default function Dashboard() {
    const borderCorner = {
        borderRadius: 0
      }
  return (
      <>
        <section>
          <div className="container p-5">
              <div className="row align-items-center">
                  <div className="col-lg-6 col-sm-12">
                      <h2>Selamat Datang di Warung Makan Bahari <br /> <b>Warung Makan yang Buka 25 Jam</b></h2>
                      <h3>Yang Makan Disini Jadi Ultramen Petot!</h3>
                      <h6>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates libero, earum nobis quam numquam corrupti praesentium id cupiditate laboriosam dignissimos optio sint quas dolor aliquam, voluptas nulla, quod in. Modi.</h6>
                      <div className="row mb-3">
                          <div className="col-sm-5 d-grid"><button className="btn btn-primary" style={borderCorner}>Makan Woi</button></div>
                          <div className="col-sm-5 d-grid"><button className="btn btn-outline-primary" style={borderCorner}>Meja</button></div>
                      </div>
                  </div>
                  <div className="col-lg-6 col-sm-12">
                      <img src="/src/assets/warung.png" alt="hero" className="img-fluid"/>
                  </div>
              </div>
          </div>
      </section>
      </>
  );
}
