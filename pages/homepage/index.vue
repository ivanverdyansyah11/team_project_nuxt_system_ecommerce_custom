<script setup lang="ts">
import {useCategoryStore} from "~/stores/category";
import {useProductStore} from "~/stores/product";
import {onMounted} from "vue";
import {formatRupiah} from "~/helpers/FormatRupiah";
import imageNotFound from '~/assets/image/other/image-not-found.svg';

definePageMeta({
  layout: 'homepage',
})

const categoryStore = useCategoryStore()
const productStore = useProductStore()

onMounted(async () => {
  categoryStore.pageSize = 8
  await categoryStore.getAllCategory()
  categoryStore.pageSize = 6
  productStore.pageSize = 8
  await productStore.getAllProduct()
  productStore.pageSize = 6
})
</script>

<template>
  <div>
    <!-- SECTION HERO -->
    <section class="hero container" id="home">
      <div class="row align-items-center">
        <div class="col-lg-6 pe-xl-5 d-none d-lg-inline-block">
          <img src="~/assets/image/homepage/section-hero/banner-image.svg" alt="Banner Image" class="banner-image" />
        </div>
        <div class="col-lg-6">
          <h1 class="headline"><span>Discover</span> Tech, Home Goods, and Fashion, <span>All in</span> One Convenient Spot</h1>
          <p class="description">Explore our diverse collection featuring the latest in technology, essential home goods, and fashionable trends-all conveniently available in a single, curated destination for your shopping pleasure.</p>
          <div class="button-group d-flex gap-2">
            <NuxtLink to="/homepage#product" class="button-primary-small">Shop Now</NuxtLink>
            <NuxtLink :to="{path: '/homepage/product'}" class="button-reverse">Explore Our Product</NuxtLink>
          </div>
          <h5>Easy Payment Method</h5>
          <div class="row g-3">
            <div class="col-6 col-md-4">
              <div class="payment-item d-flex align-items-center justify-content-center">
                <img src="~/assets/image/homepage/payment-method/visa.svg" alt="Payment Method">
              </div>
            </div>
            <div class="col-6 col-md-4">
              <div class="payment-item d-flex align-items-center justify-content-center">
                <img src="~/assets/image/homepage/payment-method/paypall.svg" alt="Payment Method">
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="payment-item d-flex align-items-center justify-content-center">
                <img src="~/assets/image/homepage/payment-method/gopay.svg" alt="Payment Method">
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- END SECTION HERO -->


    <!-- SECTION FEATURED -->
    <section class="featured section-gap container" id="featured">
      <div class="row g-3 g-md-4">
        <div class="col-6 col-lg-3">
          <div class="card-featured">
            <div class="wrapper-icon d-flex align-items-center justify-content-center">
              <i class="fa-solid fa-truck-fast"></i>
            </div>
            <h6>Free Shipping</h6>
            <p>Enjoy free delivery on all orders across the country, ensuring your purchases reach you without any additional shipping cost, adding value to every purchase.</p>
          </div>
        </div>
        <div class="col-6 col-lg-3">
          <div class="card-featured">
            <div class="wrapper-icon d-flex align-items-center justify-content-center">
              <i class="fa-solid fa-check-to-slot"></i>
            </div>
            <h6>Guaranteed Quality</h6>
            <p>We ensure high-quality products that are guaranteed to be genuine, giving you peace of mind and satisfaction with every purchase you make.</p>
          </div>
        </div>
        <div class="col-6 col-lg-3">
          <div class="card-featured">
            <div class="wrapper-icon d-flex align-items-center justify-content-center">
              <i class="fa-solid fa-money-bill-wheat"></i>
            </div>
            <h6>Money-Back Guarantee</h6>
            <p>If you’re not satisfied with your purchase, we offer a full refund, ensuring a risk-free and confident shopping experience.</p>
          </div>
        </div>
        <div class="col-6 col-lg-3">
          <div class="card-featured">
            <div class="wrapper-icon d-flex align-items-center justify-content-center">
              <i class="fa-solid fa-clock"></i>
            </div>
            <h6>24/7 Customer Service</h6>
            <p>Our dedicated support team is available around the clock to assist you with any queries or issues you may have, ensuring you are never alone.</p>
          </div>
        </div>
      </div>
    </section>
    <!-- END SECTION FEATURED -->


    <!-- SECTION SPECIAL OFFER -->
    <section class="special-offer section-gap container" id="special-offer">
      <div class="row align-items-center g-4">
        <div class="col-lg-6 pe-lg-5">
          <h6 class="subtitle">Special Offers</h6>
          <h2 class="title">Don't Miss Out on Our Special Offers! Shop Now and Save Big!</h2>
          <p class="description">Enjoy exclusive discounts available for a limited time only. Hurry and take advantage of these incredible deals before they're gone for good! Shop now to save big while you still can!</p>
        </div>
        <div class="col-lg-6">
          <div class="row g-3 g-md-4">
            <div class="col-6" v-for="(product, index) in productStore.productAll" :key="index">
              <NuxtLink :to="{path: `/homepage/product/${product.id}`}" class="card-special-offer d-flex flex-column flex-md-row align-items-center gap-3" v-if="index < 4">
                <img :src="product.image_url != '' ? `http://localhost:8000/${product.image_url}` : imageNotFound" alt="Product Image">
                <div class="special-offer-content">
                  <p class="content-discount">50% off</p>
                  <h6 class="content-title">{{product.name}}</h6>
                  <p class="content-description">{{product.description}}</p>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- END SECTION SPECIAL OFFER -->


    <!-- SECTION CATEGORY -->
    <section class="category section-gap container" id="category">
      <div class="row align-items-md-center">
        <div class="col-12 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 gap-md-0">
          <h2 class="title">Shop By Category</h2>
          <NuxtLink :to="{path: '/homepage/category'}" class="button-primary-small">Show All Category</NuxtLink>
        </div>
      </div>
      <div class="row content-gap g-3 g-md-4">
        <div class="col-6 col-md-4 col-lg-3" v-for="(category, index) in categoryStore.categoryAll" :key="index">
          <NuxtLink :to="{path: `/homepage/category/${category.id}`}" class="card-category">
            <img :src="category.image_path != '' ? `http://localhost:8000/${category.image_path}` : imageNotFound" alt="Category Image">
            <h6 class="category-name">{{category.name}}</h6>
            <div class="category-icon d-flex align-items-center justify-content-center">
              <i class="fa-solid fa-arrow-right"></i>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
    <!-- END SECTION CATEGORY -->


    <!-- SECTION ABOUT US -->
    <section class="about container section-gap" id="about">
      <div class="row align-items-center">
        <div class="col-lg-6">
          <h6 class="subtitle">About Us</h6>
          <h2 class="title"><span>All in</span> One Store: top tech, stylish fashion, and home goods <span>in one place</span></h2>
          <p class="description">Welcome to All in One Store! Explore a curated selection of top tech gadgets, stylish fashion trends, and essential home goods all conveniently in one spot. Your ultimate shopping destination for quality and convenience.</p>
          <div class="button-group d-flex align-items-center justify-content-between">
            <NuxtLink target="_blank" to="https://wa.me/08123456789" class="button-primary-small">Contact Us</NuxtLink>
            <div class="button-sosmed d-flex align-items-center" style="gap: 6px;">
              <NuxtLink target="_blank" to="https://instagram.com" class="sosmed d-flex align-items-center justify-content-center">
                <i class="fa-brands fa-instagram" style="font-size: 1.083rem;"></i>
              </NuxtLink>
              <NuxtLink target="_blank" to="https://whatsapp.com" class="sosmed d-flex align-items-center justify-content-center">
                <i class="fa-brands fa-whatsapp" style="font-size: 1.083rem;"></i>
              </NuxtLink>
              <NuxtLink target="_blank" to="https://facebook.com" class="sosmed d-flex align-items-center justify-content-center">
                <i class="fa-brands fa-facebook"></i>
              </NuxtLink>
            </div>
          </div>
        </div>
        <div class="col-lg-6 ps-xl-5 d-none d-lg-inline-block">
          <img src="~/assets/image/homepage/section-about/banner-image.svg" alt="Banner Image" class="banner-image" />
        </div>
      </div>
    </section>
    <!-- END SECTION ABOUT US -->


    <!-- SECTION CTA -->
    <div class="container">
      <section class="cta section-gap-margin position-relative" id="cta">
        <div class="cta-content position-relative d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-3 gap-md-5">
          <div class="wrapper">
            <h2 class="title">Discover the latest trends in tech, home goods, and fashion – all at your fingertips!</h2>
            <p class="description">Explore a curated selection of top tech gadgets, stylish fashion trends, and essential home goods, carefully chosen for you.</p>
          </div>
          <NuxtLink to="/homepage#product" class="button-primary-small">Shop Now</NuxtLink>
        </div>
        <div class="circle circle-right"></div>
        <div class="circle circle-top"></div>
        <div class="circle circle-left"></div>
        <div class="circle circle-bottom"></div>
      </section>
    </div>
    <!-- END SECTION CTA -->


    <!-- SECTION PRODUCT -->
    <section class="product section-gap container" id="product">
      <div class="row align-items-md-center">
        <div class="col-12 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 gap-md-0">
          <h2 class="title">Featured Product</h2>
          <NuxtLink :to="{path: '/homepage/product'}" class="button-primary-small">Show All Product</NuxtLink>
        </div>
      </div>
      <div class="row content-gap g-3 g-md-4">
        <div class="col-6 col-md-4 col-lg-3" v-for="(product, index) in productStore.productAll" :key="index">
          <NuxtLink :to="{path: `/homepage/product/${product.id}`}" class="card-product">
            <img :src="product.image_url != '' ? `http://localhost:8000/${product.image_url}` : imageNotFound" alt="Product Image">
            <div class="wrapper d-flex align-items-center justify-content-between mt-3 mb-2">
              <h6 class="product-sold">345 Sold Out</h6>
              <h6 class="product-discount" v-if="product.discount != 0">{{formatRupiah(product.price)}}</h6>
            </div>
            <div class="wrapper d-flex flex-column flex-md-row align-items-start justify-content-between gap-1 gap-md-4">
              <h6 class="product-name">{{product.name}}</h6>
              <h6 class="product-price">{{formatRupiah(product.discount != 0 ? product.price - product.discount / 100 * product.price : product.price)}}</h6>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
    <!-- END SECTION PRODUCT -->
  </div>
</template>

<style scoped>

</style>