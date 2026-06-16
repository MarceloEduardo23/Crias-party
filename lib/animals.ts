export type Animal = {
  name: string
  emoji: string
  // Using Unsplash source for real animal photos
  imageUrl: string
}

export const ANIMALS: Animal[] = [
  { name: 'Elefante', emoji: '🐘', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/African_Bush_Elephant.jpg/640px-African_Bush_Elephant.jpg' },
  { name: 'Girafa', emoji: '🦒', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Giraffe_Mikumi_National_Park.jpg/480px-Giraffe_Mikumi_National_Park.jpg' },
  { name: 'Leão', emoji: '🦁', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lion_waiting_in_Namibia.jpg/640px-Lion_waiting_in_Namibia.jpg' },
  { name: 'Pinguim', emoji: '🐧', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Emperor_penguins.jpg/480px-Emperor_penguins.jpg' },
  { name: 'Golfinho', emoji: '🐬', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Tursiops_truncatus_01.jpg/640px-Tursiops_truncatus_01.jpg' },
  { name: 'Tubarão', emoji: '🦈', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/White_shark.jpg/640px-White_shark.jpg' },
  { name: 'Gorila', emoji: '🦍', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Gorilla_gorilla_gorilla01.jpg/480px-Gorilla_gorilla_gorilla01.jpg' },
  { name: 'Panda', emoji: '🐼', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Grosser_Panda.JPG/480px-Grosser_Panda.JPG' },
  { name: 'Tigre', emoji: '🐯', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Walking_tiger_female.jpg/640px-Walking_tiger_female.jpg' },
  { name: 'Zebra', emoji: '🦓', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Plains_Zebra_Equus_quagga.jpg/640px-Plains_Zebra_Equus_quagga.jpg' },
  { name: 'Flamingo', emoji: '🦩', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Phoenicopterus_ruber_in_Santiago_de_Chile.jpg/480px-Phoenicopterus_ruber_in_Santiago_de_Chile.jpg' },
  { name: 'Coruja', emoji: '🦉', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/CapeEagleOwl.jpg/480px-CapeEagleOwl.jpg' },
  { name: 'Capivara', emoji: '🦫', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Capybara_Hattiesburg_Zoo_%2870909b-58%29_%2814910890932%29.jpg/640px-Capybara_Hattiesburg_Zoo_%2870909b-58%29_%2814910890932%29.jpg' },
  { name: 'Urso', emoji: '🐻', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Chengdu-pandas-d10.jpg/480px-Chengdu-pandas-d10.jpg' },
  { name: 'Canguru', emoji: '🦘', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Kangaroo_and_joey03.jpg/480px-Kangaroo_and_joey03.jpg' },
  { name: 'Polvo', emoji: '🐙', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Octopus2.jpg/480px-Octopus2.jpg' },
  { name: 'Coelho', emoji: '🐰', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Oryctolagus_cuniculus_Rcdo.jpg/480px-Oryctolagus_cuniculus_Rcdo.jpg' },
  { name: 'Lobo', emoji: '🐺', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Collage_of_Nine_Dogs.jpg/480px-Collage_of_Nine_Dogs.jpg' },
  { name: 'Tartaruga', emoji: '🐢', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camponotus_flavomarginatus_ant.jpg/480px-Camponotus_flavomarginatus_ant.jpg' },
  { name: 'Pavão', emoji: '🦚', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Peacock_feathers.jpg/480px-Peacock_feathers.jpg' },
]

export function pickAnimal(): Animal {
  return ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
}
