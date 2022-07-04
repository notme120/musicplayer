const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const PLAYER_STORAGE_KEY = 'storage'

        const heading = $('header h2 ')
        const cdThumb = $('.cd-thumb')
        const audio = $('#audio')
        const cd = $('.cd')
        const playBtn = $('.btn-toggle-play')
        const player = $('.player')
        const progress = $('#progress')
        const nextBtn = $('.btn-next')
        const prevBtn = $('.btn-prev')
        const randomBtn = $('.btn-random')
        const repeatBtn = $('.btn-repeat')
        const playList = $('.playlist')
        const cdSW = $('.cd-soundwave')


        console.log(playBtn)



const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,

    songs: [
        {
            name: 'Glory glory Man United',
            singer: 'The World Red Army',
            path: './assets/music/song1.mp3',
            image: './assets/img/img1.jpg'
        },
        {
            name: 'Đi Trong Mùa Hè',
            singer: 'Đen ft. Nhạc sĩ Trần Tiến',
            path: './assets/music/song2.mp3',
            image: './assets/img/img2.jpg'
        },
        {
            name: 'Ai muốn nghe không',
            singer: 'Đen ',
            path: './assets/music/song3.mp3',
            image: './assets/img/img3.jpeg'
        },
        {
            name: 'Trốn Tìm',
            singer: 'Đen ft. MTV band',
            path: './assets/music/song4.mp3',
            image: './assets/img/img4.jpg'
        },
        {
            name: 'Đi Về Nhà',
            singer: 'Đen x JustaTee',
            path: './assets/music/song5.mp3',
            image: './assets/img/img5.jpg'
        },
        {
            name: 'Mang Tiền Về Cho Mẹ',
            singer: 'Đen ft. Nguyên Thảo',
            path: './assets/music/song6.webm',
            image: './assets/img/img6.jpg'
        }
    ],


    /*setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
*/
    render: function(){
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ' '} " data-index='${index}'>
            <div class="thumb" style="background-image: url('${song.image}">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
            `
        })

        playList.innerHTML = htmls.join('')

    },
    definePropeperties: function(){
        Object.defineProperty(this, 'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })

    },

    handleEvents: function(){
        const _this = this
        
        const cdWidth = cd.offsetWidth

        //Xoay CD/ dung
        const cdAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })

        cdAnimate.pause()



        //Phong to, thu nho cd
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCDWidth = cdWidth - scrollTop

            cd.style.width = newCDWidth > 0 ? newCDWidth + 'px' : 0
            cd.style.opacity = newCDWidth / cdWidth
            cdSW.style.opacity = newCDWidth / cdWidth

            

        }

        //xu ly khi click nut play
        playBtn.onclick = function() {
            if (_this.isPlaying){

            audio.pause()
            } else{  
            audio.play()

            }

        }

        //khi bai hat play
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add('playing')
            cdAnimate.play()
            cdSW.classList.add('active')

        },

                //khi bai hat bi pause
        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdAnimate.pause()
            cdSW.classList.remove('active')

        }

        //Khi tien do bai hat thay doi
        audio.ontimeupdate = function(){
            if (audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent

            }

        }

        //tua bai hat
        progress.onchange = function(e){
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime

        }

        //Khi banm next
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        //bam nut prev
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            
            
            audio.play()
            _this.render()
            _this.scrollToActiveSong()

        }

        //nut random
        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom
           
            randomBtn.classList.toggle('active', _this.isRandom)
            
        }

        //phat lai bai hat

        repeatBtn.onclick = function() {

            _this.isRepeat = !_this.isRepeat
            

            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        //xu ly next song khi audio end
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()

            } else {
                nextBtn.click()
            }
            
        }

        //Nghe hanh vi clck vao play list

        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode ||
            !e.target.closest('.option')
            ) {
                //khi clck vao song
                if (songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    audio.play()
                    _this.render()

                }

                //Khi click vao song option
                if (e.target.closest('.option')){

                }

            }

        }
     
     



    },

    scrollToActiveSong: function(){
        setTimeout(() =>{
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        }, 300)
    },
    

    loadCurrentSong: function(){
        const heading = $('header h2 ')
        const cdThumb = $('.cd-thumb')
        const audio = $('#audio')

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}') `
        audio.src = this.currentSong.path



    },

    nextSong: function () {
        this.currentIndex++;
        if ( this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--;
        if ( this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    playRandomSong: function(){
        let newIndex
        do{
        newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

/*    playRandomSong: function () {
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
    
        this.currentIndex = newIndex;
        this.loadCurrentSong();
      },
*/

    start : function(){
        this.definePropeperties()

        this.handleEvents()

       this.loadCurrentSong()


        this.render()


    }
}

app.start()