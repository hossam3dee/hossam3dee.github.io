const boat = document.querySelector('model-viewer');

const onProgress = (event) => {
  const progressBar = event.target.querySelector('.progress-bar');
  const updatingBar = event.target.querySelector('.update-bar');
  if (updatingBar) {
    updatingBar.style.width = `${event.detail.totalProgress * 100}%`;
  }
  if (event.detail.totalProgress === 1) {
    if (progressBar) progressBar.classList.add('hide');
    event.target.removeEventListener('progress', onProgress);
  } else if (progressBar) {
    progressBar.classList.remove('hide');
  }
};
boat.addEventListener('progress', onProgress);

boat.addEventListener('load', () => {
  const waterline = boat.model && boat.model.materials ? boat.model.materials[6] : null;
  const radar = boat.model && boat.model.materials ? boat.model.materials[7] : null;

  // Waterline Buttons & Swatches
  const swatchBtns = document.querySelectorAll('.swatch-btn, .btn-hide');
  const setWaterlineActive = (activeBtn) => {
    swatchBtns.forEach(btn => {
      btn.classList.remove('active');
      if (btn.classList.contains('swatch-btn')) {
        btn.innerHTML = '';
      }
    });
    activeBtn.classList.add('active');
    if (activeBtn.classList.contains('swatch-btn')) {
      activeBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    }
  };

  const btnRed = document.querySelector('.btn-red');
  const btnGreen = document.querySelector('.btn-green');
  const btnBlue = document.querySelector('.btn-blue');
  const btnHide = document.querySelector('.btn-hide');

  if (btnRed) {
    btnRed.addEventListener('click', () => {
      if (waterline) waterline.pbrMetallicRoughness.setBaseColorFactor([0.81, 0.1, 0.17, 1]);
      setWaterlineActive(btnRed);
    });
  }

  if (btnGreen) {
    btnGreen.addEventListener('click', () => {
      if (waterline) waterline.pbrMetallicRoughness.setBaseColorFactor([0.13, 0.77, 0.37, 1]);
      setWaterlineActive(btnGreen);
    });
  }

  if (btnBlue) {
    btnBlue.addEventListener('click', () => {
      if (waterline) waterline.pbrMetallicRoughness.setBaseColorFactor([0.23, 0.51, 0.96, 1]);
      setWaterlineActive(btnBlue);
    });
  }

  if (btnHide) {
    btnHide.addEventListener('click', () => {
      if (waterline) waterline.pbrMetallicRoughness.setBaseColorFactor([0, 0, 0, 0]);
      setWaterlineActive(btnHide);
    });
  }

  // Radar Buttons
  const radarShow = document.querySelector('.radar-show');
  const radarRemove = document.querySelector('.radar-remove');

  if (radarShow && radarRemove) {
    radarShow.addEventListener('click', () => {
      if (radar) radar.pbrMetallicRoughness.setBaseColorFactor([1, 1, 1, 1]);
      radarShow.classList.add('active');
      radarRemove.classList.remove('active');
    });

    radarRemove.addEventListener('click', () => {
      if (radar) radar.pbrMetallicRoughness.setBaseColorFactor([0, 0, 0, 0]);
      radarRemove.classList.add('active');
      radarShow.classList.remove('active');
    });
  }

  // Camera Views
  const btnAngle1 = document.querySelector('.btn-angle1');
  const btnAngle2 = document.querySelector('.btn-angle2');

  if (btnAngle1 && btnAngle2) {
    btnAngle1.addEventListener('click', () => {
      boat.setAttribute('camera-orbit', '30deg 80deg 6m');
      boat.setAttribute('camera-target', '0m 1m 0m');
      btnAngle1.classList.add('active');
      btnAngle2.classList.remove('active');
    });

    btnAngle2.addEventListener('click', () => {
      boat.setAttribute('camera-orbit', '160deg 80deg 6m');
      boat.setAttribute('camera-target', '0m 0.5m 0m');
      btnAngle2.classList.add('active');
      btnAngle1.classList.remove('active');
    });
  }
});


