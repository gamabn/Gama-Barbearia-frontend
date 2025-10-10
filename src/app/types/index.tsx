export interface  BarberProps{
    id: string;
    name: string;   
    barber_phone: string;
    img_url: string;
    public_id: string;
    barbearia_id: string;
}

export interface BarberShopProps{
    id: string;
    name: string;
    phone: string;
    image_url: string;
    email: string;
   neighborhood: string;
   city: string;
   street: string;
   number: string;
   public_id:string;
}

export interface BarberServiceProps{
    id: string;
    name: string;
    duration: string;
    price: number;
    barber_id: number;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: {
    hours: number;
    minutes: number;
    seconds: number;
  };
}
export interface barberWeekHours{
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  active: boolean;
  barbearia_id: string;


}